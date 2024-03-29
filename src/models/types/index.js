import { Schema } from "mongoose";
import validate from "mongoose-validator";

export const trimmedString = { type: String, trim: true };

export const email = {
  ...trimmedString,
  lowercase: true,
  validate: [
    validate({
      validator: "isEmail",
      passIfEmpty: true,
      message: "Invalid Email",
    }),
  ],
};

export const url = {
  ...trimmedString,
  validate: [validate({ validator: "isURL" })],
};

// todo url validition issue
export const avatar = url;

export const detailedname = {
  prefix: trimmedString,
  first: trimmedString,
  middle: trimmedString,
  last: trimmedString,
};

export const bloodGroup = {
  type: String,
  enum: ["a+", "b+", "o+", "ab+", "a-", "b-", "o-", "ab-", "unknown"],
  lowercase: true,
  default: "unknown",
};

export const addressSchema = new Schema(
  {
    visibility: {
      type: String,
      enum: ["public", "private", "request"],
      default: "private",
    },
    street: trimmedString,
    area: trimmedString,
    pincode: {
      type: String,
      validate: (v) => String(v).length === 6,
    },
  },
  { timestamps: false }
);

export const gender = {
  type: String,
  lowercase: true,
  enum: ["male", "female", "non-binary"],
};

export const user = {
  type: Schema.Types.ObjectId,
  required: true,
  ref: "user",
};

export const patient = {
  type: Schema.Types.ObjectId,
  required: true,
  ref: "patient",
};

export function addAgeVirtual(schema, datefield, ageDetails = false) {
  schema.virtual("age").get(function () {
    if (!this[datefield]) return;

    const dateDif = new Date(Date.now() - this[datefield].getTime());
    return dateDif.getFullYear() - 1970;
  });

  if (ageDetails)
    schema.virtual("ageDetails").get(function () {
      if (!this[datefield]) return;
      const dateDif = new Date(Date.now() - this[datefield].getTime());
      const year = dateDif.getFullYear() - 1970;
      const month = dateDif.getMonth();
      const days = dateDif.getDate();

      return {
        year,
        month,
        days,
        statement: `${year} Years and ${month} months`,
      };
    });
}

export function addFullnameVirtual(schema) {
  schema.virtual("initials").get(function () {
    return (
      this.name &&
      ((this.name.first && this.name.first[0]) || "") +
        ((this.name.last && this.name.last[0]) || "")
    );
  });

  schema.virtual("prefixFullname").get(function () {
    if (!this.name) return;

    return [
      this.prefix || this.name.prefix,
      this.name.first,
      this.name.middle,
      this.name.last,
    ]
      .map((e) => e && e.trim())
      .filter((e) => !!e)
      .join(" ");
  });

  schema
    .virtual("fullname")
    .get(function () {
      if (!this.name) return;

      return [this.name.first, this.name.middle, this.name.last]
        .map((e) => e && e.trim())
        .filter((e) => !!e)
        .join(" ");
    })
    .set(function (v) {
      const t = v.trim().split(" ");

      if (t[2]) {
        [this.name.first, this.name.middle, this.name.last] = t;
      } else {
        [this.name.first, this.name.last] = t;
        this.name.middle = "";
      }
    });
}

export const amountType = {
  type: Number,
  min: 0,
  default: () => 0,
};

export const contactType = {
  type: String,
  // enum: [
  //   "Patient",
  //   "Hospital",
  //   "doctor",
  //   "Medical Representative (MR)",
  //   "Other",
  // ],
};
