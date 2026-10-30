import { describe, expect, it } from "vitest";
import { InvalidPixAmountError, InvalidPixFieldError } from "../errors";
import { crc16Ccitt } from "./crc16";
import { buildPixBrCode } from "./pix-brcode";

const baseInput = {
  pixKey: "123e4567-e12b-12d1-a456-426655440000",
  receiverName: "Fulano de Tal",
  city: "Brasilia",
};

const CHECKSUM_LENGTH = 4;

function splitChecksum(brCode: string) {
  return {
    body: brCode.slice(0, -CHECKSUM_LENGTH),
    checksum: brCode.slice(-CHECKSUM_LENGTH),
  };
}

function readFields(payload: string): Record<string, string> {
  const fields: Record<string, string> = {};
  let cursor = 0;
  while (cursor < payload.length) {
    const fieldId = payload.slice(cursor, cursor + 2);
    const length = Number(payload.slice(cursor + 2, cursor + 4));
    fields[fieldId] = payload.slice(cursor + 4, cursor + 4 + length);
    cursor += 4 + length;
  }
  return fields;
}

describe("buildPixBrCode", () => {
  it("builds the reference static payload without amount", () => {
    const { body } = splitChecksum(buildPixBrCode(baseInput));

    expect(body).toBe(
      "00020101021126580014br.gov.bcb.pix0136123e4567-e12b-12d1-a456-4266554400005204000053039865802BR5913FULANO DE TAL6008BRASILIA62070503***6304",
    );
  });

  it("ends with a valid CRC of everything before it", () => {
    const { body, checksum } = splitChecksum(buildPixBrCode({ ...baseInput, amountCents: 15050 }));

    expect(checksum).toBe(crc16Ccitt(body));
  });

  it("encodes amount with two decimals and dot", () => {
    const fields = readFields(buildPixBrCode({ ...baseInput, amountCents: 15050 }));

    expect(fields["54"]).toBe("150.50");
    expect(fields["53"]).toBe("986");
    expect(fields["58"]).toBe("BR");
  });

  it("omits the amount field when no amount is given", () => {
    expect(readFields(buildPixBrCode(baseInput))["54"]).toBeUndefined();
  });

  it("marks the payload as static and nests key under the pix GUI", () => {
    const fields = readFields(buildPixBrCode(baseInput));
    const merchantAccount = readFields(fields["26"]);

    expect(fields["01"]).toBe("11");
    expect(merchantAccount["00"]).toBe("br.gov.bcb.pix");
    expect(merchantAccount["01"]).toBe(baseInput.pixKey);
  });

  it("defaults the transaction id to asterisks", () => {
    expect(readFields(readFields(buildPixBrCode(baseInput))["62"])["05"]).toBe("***");
  });

  it("strips accents, uppercases and truncates name and city", () => {
    const fields = readFields(
      buildPixBrCode({
        ...baseInput,
        receiverName: "Agnes Sammy de Oliveira Conceição Silva",
        city: "São José do Rio Preto",
      }),
    );

    expect(fields["59"]).toBe("AGNES SAMMY DE OLIVEIRA C");
    expect(fields["59"].length).toBeLessThanOrEqual(25);
    expect(fields["60"]).toBe("SAO JOSE DO RIO");
    expect(fields["60"].length).toBeLessThanOrEqual(15);
  });

  it.each([0, -1, 10.5, Number.NaN, 10_000_000_000])("rejects amount %s", (amountCents) => {
    expect(() => buildPixBrCode({ ...baseInput, amountCents })).toThrow(InvalidPixAmountError);
  });

  it("rejects empty key, name and city", () => {
    expect(() => buildPixBrCode({ ...baseInput, pixKey: " " })).toThrow(InvalidPixFieldError);
    expect(() => buildPixBrCode({ ...baseInput, receiverName: "***" })).toThrow(InvalidPixFieldError);
    expect(() => buildPixBrCode({ ...baseInput, city: "" })).toThrow(InvalidPixFieldError);
  });

  it("uses a sanitized custom transaction id", () => {
    const fields = readFields(buildPixBrCode({ ...baseInput, transactionId: "ped-123 abc" }));

    expect(readFields(fields["62"])["05"]).toBe("ped123abc");
  });
});
