/** deedId → the earlier deed that inspired it. Builds a few multi-level ripple trees. */
export const SEED_RIPPLES: Record<string, string> = {
  // Sarah's lake cleanup → Jonas → Ryan, and Lena
  d_jonas_1: "d_sarah_2",
  d_ryan_1: "d_jonas_1",
  d_lena_1: "d_sarah_2",
  // Tom's sapling nursery → Sarah's lake planting
  d_sarah_1: "d_tom_1",
  // Sarah's seed swap → Sam's swap meet
  d_sam_1: "d_sarah_5",
  // Maya's work → Ana, Oliver, Rafael
  d_ana_1: "d_maya_3",
  d_oliver_1: "d_maya_2",
  d_rafael_1: "d_maya_7",
  // Aarav's notebook drive → Ishita's uniforms, Zara's exam prep
  d_ishita_2: "d_aarav_7",
  d_zara_2: "d_aarav_7",
  // Ramesh's story hour → Kabir, Emma
  d_kabir_1: "d_ramesh_1",
  d_emma_1: "d_ramesh_1",
  // Marcus's food rescue → Felix
  d_felix_1: "d_marcus_2",
};
