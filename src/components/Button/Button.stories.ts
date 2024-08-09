import { Meta, StoryObj } from "@storybook/react";
import Button from "./Button";

export default {
  title: "Components/Button",
  component: Button,
  argTypes: {
    variant: {
      options: [
        "primary",
        "secondary",
        "success",
        "danger",
        "warning",
        "info",
        "light",
        "dark",
        "link",
      ],
      control: { type: "select" },
    },
    size: {
      options: ["sm", "lg"],
      control: { type: "select" },
    },
  },
} as Meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: "primary",
    children: "Button",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Button",
  },
};
