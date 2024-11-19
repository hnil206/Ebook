import Setting from '../models/setting.model';

async function newSetting(
  data: any,
  userId: string,
): Promise<InstanceType<typeof Setting>> {
  if (!userId) {
    throw new Error('userId is required');
  }
  const defaultBookOption = {
    flow: 'paginated',
    resizeOnOrientationChange: true,
    spread: 'auto',
  };

  const defaultBookStyle = {
    fontFamily: 'Origin',
    fontSize: 25,
    lineHeight: 1.9,
    marginHorizontal: 10,
    marginVertical: 8,
  };

  const updatedData = {
    userId: userId,
    bookOption: { ...defaultBookOption, ...data.bookOption },
    bookStyle: { ...defaultBookStyle, ...data.bookStyle },
  };

  const setting = await Setting.findOneAndUpdate({ userId }, updatedData, {
    new: true,
    upsert: true,
  });

  return setting;
}

async function getSetting(
  userId: string,
): Promise<InstanceType<typeof Setting> | null> {
  if (!userId) {
    throw new Error('userId is required');
  }

  const setting = await Setting.findOne({ userId }).exec();

  return setting || null;
}

async function getAllSetting(): Promise<InstanceType<typeof Setting>[]> {
  const settings = await Setting.find();
  return settings;
}

export { getAllSetting, getSetting, newSetting };
