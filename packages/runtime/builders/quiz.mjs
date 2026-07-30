/**
 * Quiz Builder alias — registry maps quiz_generation → builder "quiz"
 * This loads the assessment builder implementation.
 */

import assessment from "./assessment.mjs";
export default assessment;
export const { execute, validate, preview, status, cancel, resume } = assessment;
