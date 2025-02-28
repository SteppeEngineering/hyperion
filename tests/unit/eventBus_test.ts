// tests/unit/eventBus_test.ts

import { assertEquals } from "https://deno.land/std@0.224.0/testing/asserts.ts";
import { emitEvent, onEvent } from "../../src/eventBus.ts";

Deno.test("EventBus - should emit and receive events correctly", () => {
  const testEventType = "testEvent";
  const testPayload = { data: "testData" };

  let receivedPayload: any;

  onEvent(testEventType, (payload) => {
    receivedPayload = payload;
  });

  emitEvent(testEventType, testPayload);

  assertEquals(receivedPayload, testPayload);
});
