import { usePostHog } from '@posthog/react';
import { ChipsGroup } from '@/shared/ui';
import { MODES, MODE_LABELS, type Mode } from '../model/types';
import { useHomeModes } from '../model/useHomeModes';

const options: ReadonlyArray<{ label: string; value: Mode }> = MODES.map((m) => ({
  label: MODE_LABELS[m],
  value: m,
}));

export const ModeTabs = () => {
  const { modes, setModes } = useHomeModes();
  const posthog = usePostHog();

  return (
    <ChipsGroup
      label="Select creative group"
      mobileLabel="Group"
      mode="multiple"
      allowEmpty={true}
      options={options}
      value={modes}
      onChange={(value) => {
        const next = (Array.isArray(value) ? value : []) as Mode[];
        setModes(next);
        posthog?.capture('modes_selected', { modes: next });
      }}
    />
  );
};
