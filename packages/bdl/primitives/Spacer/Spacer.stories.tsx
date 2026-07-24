import type { Meta, StoryObj } from '@storybook/react';
import { Spacer } from './Spacer';

const meta: Meta<typeof Spacer> = {
  title: 'Primitives/Spacer',
  component: Spacer,
};
export default meta;

type Story = StoryObj<typeof Spacer>;
export const Default: Story = {};
