import { drawTrips, addTrip, setDateLimitions } from "./app";

describe("app tests", () => {
  it("Testing the drawTrips() function", () => {
    expect(drawTrips).toBeDefined();
  });

  it("Testing the addTrip() function", () => {
    expect(addTrip).toBeDefined();
  });

  it("Testing the setDateLimitions() function", () => {
    expect(setDateLimitions).toBeDefined();
  });
});
