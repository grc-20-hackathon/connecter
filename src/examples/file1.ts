// // If you haven't deployed a personal space yet you can deploy one
// // by running deploySpace. This will return the spaceId. Make sure
// // you remember this.
// //
// // If you've already deployed a personal space and have the spaceId
// // you can skip this step.
// // const spaceId = await deploySpace({
// // 	spaceName: "YOUR SPACE NAME",
// // 	initialEditorAddress: "YOUR WALLET ACCOUNT ADDRESS", // 0x...
// // });
// //
// // console.log("Your spaceId is:", spaceId);
//
// import type { Params } from '../lib/grapf/create-entity.ts';
// import { JOB_OPENING, ROLE_PROPERTY } from '../lib/ids/system.ts';
//
// const fullStackEngineer: Params = {
//   name: "Full Stack Engineer",
//   description:
//     "A Full Stack Engineer is a software engineer who works on both the front-end and back-end of an application.",
//   types: [ROLE_PROPERTY],
// };
//
// const VacationAtZircuit: Params = {
//   name: "Senior Full Stack Engineer at Zircuit",
//   description:
//     "Zircuit seeks a Full-Stack Engineer to build AI-blockchain DApps in a remote role with competitive perks and team retreats.",
//   types: [JOB_OPENING],
// };
//
// const Remote: Params = {
//   name: "Remote",
//   description:
//     "Remote work is a form of work in which employees perform their duties outside of a traditional office, often from home or other locations.",
//   types: ["UZJEi1nNA7NKys64rJoHKA"],
// };
//
// const FullTime: Params = {
//   name: "Test content",
//   types: [CONTINENT_TYPE],
// };
//
// const EmploymentType: Params = {};
//
// // const ProjectEntity: Params = {
// // 	name: 'Zircuit',
// // 	description: 'The AI powered chain for secure, automated finance.',
// // 	types: [PROJECT_TYPE, COMPANY_TYPE],
// // };
//
// // const ProjectEntity: Params = {
// // 	name: 'Employment type',
// // 	types: ['VdTsW1mGiy1XSooJaBBLc4'],
// // };
//
// const { id, ops } = createEntity(FullTime);
//
// //const createRole = createEntity(fullStackEngineer);
//
// // const websiteTripleOp = Triple.make({
// // 	entityId: 'TntfVPn58rTs5AtpDKp5zY',
// // 	attributeId: WEBSITE_PROPERTY,
// // 	value: {
// // 		type: 'URL',
// // 		value: 'https://zircuit.com',
// // 	},
// // });
//
// const websiteTripleOp = Triple.make({
//   entityId: "Up77A3syqK5eaR4jt1WTgT",
//   attributeId: TEXT_BLOCK,
//   value: {
//     type: "TEXT",
//     value: "DDDDDD",
//   },
// });
//
// const xTripleOp = Triple.make({
//   entityId: "TntfVPn58rTs5AtpDKp5zY",
//   attributeId: X_PROPERTY,
//   value: {
//     type: "URL",
//     value: "https://x.com/ZircuitL2",
//   },
// });
//
// const createRolesRelation = Relation.make({
//   fromId: "4eGpHknrRLoF2Jc7dGtFxD",
//   toId: FULL_STACK_ROLE,
//   relationTypeId: ROLES_ATTRIBUTE,
// });
//
// const createSkillRelation = Relation.make({
//   fromId: "4eGpHknrRLoF2Jc7dGtFxD",
//   toId: TS_SKILL,
//   relationTypeId: SKILLS_ATTRIBUTE,
// });
// const createSkillRelationjS = Relation.make({
//   fromId: "4eGpHknrRLoF2Jc7dGtFxD",
//   toId: JS_SKILL,
//   relationTypeId: SKILLS_ATTRIBUTE,
// });
//
// const createProjectRelation = Relation.make({
//   fromId: "4eGpHknrRLoF2Jc7dGtFxD",
//   toId: "TntfVPn58rTs5AtpDKp5zY",
//   relationTypeId: PROJECT_TYPE,
// });
//
// const createSpaceRelation = Relation.make({
//   fromId: "4eGpHknrRLoF2Jc7dGtFxD",
//   toId: "FqxRFcpSTgoT61sTLwSPHD",
//   relationTypeId: "BLCNN8nrcU6T6NLu2QDQtw",
// });
// const createSpaceRelation1 = Relation.make({
//   fromId: "4eGpHknrRLoF2Jc7dGtFxD",
//   toId: "E224h7U3z7r9FvazLwF1oZ",
//   relationTypeId: "BLCNN8nrcU6T6NLu2QDQtw",
// });
//
// const deleteRelation1 = Relation.remove("P15AxNWqsj3x1sfXPWjCgu");
// const deleteRelation2 = Relation.remove("KE4HBqN4UQeJnNAKbHGFRw");
// const deleteTriplet = Triple.remove({
//   attributeId: MARKDOWN_CONTENT,
//   entityId: "4eGpHknrRLoF2Jc7dGtFxD",
// });
//
// const websiteTripleOp2 = Triple.make({
//   entityId: "Up77A3syqK5eaR4jt1WTgT",
//   attributeId: TEXT_BLOCK,
//   value: {
//     type: "TEXT",
//     value: "DDDDDD",
//   },
// });
