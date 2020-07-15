import { Schema } from "mongoose";

export const trimmedString = { type: String, trim: true };

export function addAgeVirtual(schema, datefield) {
  schema.virtual("age").get(function () {
    if (!this[datefield]) return;

    let dateDif = new Date(Date.now() - this[datefield].getTime());
    return dateDif.getFullYear() - 1970;
  });

  schema.virtual("ageDetailed").get(function () {
    if (!this[datefield]) return;

    let dateDif = new Date(Date.now() - this[datefield].getTime());

    let year = dateDif.getFullYear() - 1970;
    let month = dateDif.getMonth();
    let date = dateDif.getDate();

    // `${year} Years and ${month} months`;
    return { year, month, date };
  });
}

export function addFullnameVirtual(schema) {
  schema.virtual("initials").get(function () {
    return (
      this.name &&
      this.name.first[0] + ((this.name.last && this.name.last[0]) || "")
    );
  });

  schema.virtual("prefixFullname").get(function () {
    if (!this.name) return;

    return [
      this.prefix,
      this.name.first,
      this.name.middle,
      this.name.last,
    ].join(" ");
  });

  schema
    .virtual("fullname")
    .get(function () {
      if (!this.name) return;

      return [this.name.first, this.name.middle, this.name.last].join(" ");
    })
    .set(function (v) {
      let t = v.split(" ");

      this.name.first = t[0];
      if (t[2]) {
        this.name.middle = t[1];
        this.name.last = t[2];
      } else {
        this.name.last = t[1];
        this.name.middle = "";
      }
    });
}

export const bloodGroup = {
  type: String,
  enum: ["a+", "b+", "o+", "ab+", "a-", "b-", "o-", "ab-", "unknown"],
  lowercase: true,
  default: "unknown",
};

export const addressSchema = new Schema(
  {
    street: trimmedString,
    area: trimmedString,
    pincode: {
      type: String,
      validate: (v) => String(v).length == 6,
    },
  },
  { timestamps: false }
);

export const gender = {
  type: String,
  lowercase: true,
  enum: ["male", "female", "non-binary"],
};
