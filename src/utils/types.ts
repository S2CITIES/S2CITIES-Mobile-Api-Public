export type RawIntEnum<T> = `${Extract<
   T,
   number
>}` extends `${infer N extends number}`
   ? N
   : never;
