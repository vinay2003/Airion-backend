import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const schema = z.object({
  reqField: z.string(),
  optField: z.string().optional()
});

class MyDto extends createZodDto(schema) {}

function test(dto: Partial<MyDto>) {
  console.log("TS compiles it");
}
test({});
