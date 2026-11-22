/** Hand-authored relationships for the demo personas; others are generated. */
export const PRIMARY_FOLLOWING: Record<string, string[]> = {
  u_sarah: ["u_lena", "u_tom", "u_chloe", "u_jonas", "u_ryan", "u_aarav", "u_maya", "u_ishita", "u_emma", "u_sam"],
  u_aarav: ["u_sarah", "u_maya", "u_marcus", "u_kamala", "u_vikram", "u_daniel", "u_ishita", "u_noor", "u_felix", "u_zara", "u_kabir", "u_ramesh"],
  u_maya: ["u_sarah", "u_aarav", "u_ana", "u_oliver", "u_rafael", "u_zara", "u_vikram"],
};

export const PRIMARY_FOLLOWERS: Record<string, string[]> = {
  u_sarah: ["u_lena", "u_tom", "u_chloe", "u_ishita", "u_zara", "u_jonas", "u_sam", "u_ryan", "u_emma", "u_kabir", "u_camila", "u_kamala"],
  u_aarav: ["u_marcus", "u_kamala", "u_vikram", "u_ishita", "u_daniel", "u_noor", "u_kabir", "u_felix", "u_ramesh", "u_zara", "u_ethan", "u_lukas", "u_camila"],
  u_maya: ["u_ana", "u_oliver", "u_rafael", "u_zara", "u_vikram", "u_noor", "u_emma", "u_kamala", "u_ishita"],
};

export const PRIMARY_SAVES: Record<string, string[]> = {
  u_sarah: ["d_tom_2", "d_chloe_1", "d_ramesh_1"],
  u_aarav: ["d_kamala_1", "d_marcus_1", "d_vikram_1"],
  u_maya: ["d_ana_1", "d_oliver_1"],
};

/** Each demo persona has liked these deeds (guaranteed, on top of generated likes). */
export const PRIMARY_LIKES: Record<string, string[]> = {
  u_sarah: ["d_aarav_1", "d_maya_2", "d_lena_1", "d_tom_2", "d_chloe_1", "d_ishita_1", "d_kamala_1", "d_ramesh_1"],
  u_aarav: ["d_sarah_1", "d_maya_2", "d_kamala_1", "d_vikram_1", "d_marcus_1", "d_ishita_1", "d_zara_1"],
  u_maya: ["d_sarah_1", "d_aarav_1", "d_ana_1", "d_oliver_1", "d_rafael_1", "d_zara_1", "d_vikram_1"],
};
