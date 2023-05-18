import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import React from "react";
import MyComponent from "../pages/MyComponent";

test("renders the component correctly", () => {
  render(<MyComponent />);
  expect(screen.getByText("Hello, World!")).toBeInTheDocument();
});
