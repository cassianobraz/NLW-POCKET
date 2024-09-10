import fastify from "fastify";
import { createGoal } from "../functions/create-goal";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import z from "zod";
import { getWeekPendingGoals } from "../functions/getWeekPendingGoals";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.get("/pending-goals", async () => {
  const sql = await getWeekPendingGoals();

  return sql
});

app.post(
  "/goals",
  {
    schema: {
      body: z.object({
        title: z.string(),
        desiredWeeklyFrequency: z.number().int().min(1).max(7),
      }),
    },
  },
  async (req) => {
    const { title, desiredWeeklyFrequency } = req.body;
    await createGoal({
      title,
      desiredWeeklyFrequency,
    });
  }
);

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log(`HTTP server running!`);
  });
