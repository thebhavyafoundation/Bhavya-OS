import type { Meta, StoryObj } from '@storybook/react';
import { Section } from './Section';

const meta: Meta<typeof Section> = {
  title: 'Primitives/Section',
  component: Section,
};
export default meta;

type Story = StoryObj<typeof Section>;
export const Default: Story = {};
