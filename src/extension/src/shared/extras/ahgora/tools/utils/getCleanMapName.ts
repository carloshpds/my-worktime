export const getCleanMapName = (csgoMapName: string) => {
  return csgoMapName.replaceAll("de_", "")
}