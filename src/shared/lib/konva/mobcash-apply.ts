import type Konva from 'konva';
import type { MobcashEntry } from '@/shared/store/app-store';
import { calculateMobcashLayout } from './mobcash-layout';

export const MOBCASH_OVERLAY_GROUP_NAME = 'mobcash-overlay';
export const MOBCASH_CITY_BOX_NAME = 'mobcash-city-box';
export const MOBCASH_CITY_VALUE_NAME = 'mobcash-city-value';
export const MOBCASH_STREET_BOX_NAME = 'mobcash-street-box';
export const MOBCASH_STREET_VALUE_NAME = 'mobcash-street-value';

export const captureOriginalMobcash = (stage: Konva.Stage | null): MobcashEntry | null => {
  if (!stage) return null;
  const group = stage.findOne<Konva.Group>(`.${MOBCASH_OVERLAY_GROUP_NAME}`);
  if (!group || !group.visible()) return null;
  const cityNode = stage.findOne<Konva.Text>(`.${MOBCASH_CITY_VALUE_NAME}`);
  const streetNode = stage.findOne<Konva.Text>(`.${MOBCASH_STREET_VALUE_NAME}`);
  return {
    code: '',
    city: cityNode?.text() ?? '',
    street: streetNode?.text() ?? '',
  };
};

export const applyMobcashOverlayToStage = (
  stage: Konva.Stage | null,
  entry: MobcashEntry | null,
) => {
  if (!stage) return;

  const group = stage.findOne<Konva.Group>(`.${MOBCASH_OVERLAY_GROUP_NAME}`);
  if (!group) return;

  const visible = entry !== null;
  group.visible(visible);
  if (!visible) {
    group.getLayer()?.batchDraw();
    return;
  }

  const stageWidth = stage.width();
  const stageHeight = stage.height();
  const cityDisplay = entry.city.toUpperCase();
  const streetDisplay = entry.street.toUpperCase();
  const layout = calculateMobcashLayout(stageWidth, stageHeight, cityDisplay, streetDisplay);

  const cityBox = stage.findOne<Konva.Rect>(`.${MOBCASH_CITY_BOX_NAME}`);
  if (cityBox) {
    cityBox.x(layout.city.boxX);
    cityBox.y(layout.city.boxY);
    cityBox.width(layout.city.boxW);
    cityBox.height(layout.city.boxH);
    cityBox.cornerRadius(layout.city.boxRadius);
  }

  const cityValue = stage.findOne<Konva.Text>(`.${MOBCASH_CITY_VALUE_NAME}`);
  if (cityValue) {
    cityValue.text(cityDisplay);
    cityValue.x(layout.city.valueX);
    cityValue.y(layout.city.boxY);
    cityValue.width(layout.city.valueW);
    cityValue.height(layout.city.boxH);
    cityValue.fontSize(layout.city.valueFontSize);
  }

  const streetBox = stage.findOne<Konva.Rect>(`.${MOBCASH_STREET_BOX_NAME}`);
  if (streetBox) {
    streetBox.x(layout.street.boxX);
    streetBox.y(layout.street.boxY);
    streetBox.width(layout.street.boxW);
    streetBox.height(layout.street.boxH);
    streetBox.cornerRadius(layout.street.boxRadius);
  }

  const streetValue = stage.findOne<Konva.Text>(`.${MOBCASH_STREET_VALUE_NAME}`);
  if (streetValue) {
    streetValue.text(streetDisplay);
    streetValue.x(layout.street.valueX);
    streetValue.y(layout.street.boxY);
    streetValue.width(layout.street.valueW);
    streetValue.height(layout.street.boxH);
    streetValue.fontSize(layout.street.valueFontSize);
  }

  group.getLayer()?.batchDraw();
};
