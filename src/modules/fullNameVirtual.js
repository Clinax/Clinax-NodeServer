export default function (schema) {
  schema.virtual("initials").get(function () {
    return (
      this.name &&
      this.name.first[0] + ((this.name.last && this.name.last[0]) || "")
    );
  });
  schema
    .virtual("fullname")
    .get(function () {
      if (!this.name) return;

      return (
        (this.prefix || "") +
        " " +
        this.name.first +
        " " +
        (this.name.middle || "") +
        " " +
        (this.name.last || "")
      )
        .replace("  ", " ")
        .trim();
    })
    .set(function (v) {
      let t = v.split(" ");

      this.name.first = t[0];
      if (t[2]) {
        this.name.middle = t[1];
        this.name.last = t[2];
      } else this.name.last = t[1];
    });
}
