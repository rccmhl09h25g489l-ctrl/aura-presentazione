import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Button } from "@/components/ui/button";

describe("Button composition", () => {
  it("renders an asChild link and invokes its action without a hook error", () => {
    const onClick = vi.fn((event: React.MouseEvent) => event.preventDefault());
    render(<Button asChild><a href="https://aura-leaderbord.vercel.app/" onClick={onClick}>Progetto di prova</a></Button>);
    const link = screen.getByRole("link", { name: "Progetto di prova" });
    fireEvent.click(link);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(link.getAttribute("href")).toBe("https://aura-leaderbord.vercel.app/");
  });
});