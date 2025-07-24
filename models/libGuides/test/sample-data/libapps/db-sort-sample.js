const sortableDbs = [
  {
    name: 'Monkeys',
    subjects: [
      { name: 'English', featured: 3 },
      { name: 'Spanish', featured: 1 },
    ],
  },
  {
    name: 'Journal of Tree Frogs',
    subjects: [
      { name: 'English', featured: 2 },
      { name: 'Spanish', featured: 0 },
    ],
  },
  {
    name: 'Comm Abstracts',
    subjects: [
      { name: 'English', featured: 0 },
      { name: 'Spanish', featured: 2 },
    ],
  },
  {
    name: 'Access Complete',
    subjects: [
      { name: 'English', featured: 1 },
      { name: 'Spanish', featured: 0 },
    ],
  },
  {
    name: 'MLA',
    subjects: [
      { name: 'English', featured: 1 },
      { name: 'Spanish', featured: 0 },
    ],
  },
  {
    name: 'Green Eggs and Ham',
    subjects: [
      { name: 'English', featured: 1 },
      { name: 'Spanish', featured: 0 },
    ],
  },
  {
    name: 'Theatre Index',
    subjects: [
      { name: 'English', featured: 0 },
      { name: 'Spanish', featured: 0 },
    ],
  },
];

const expectedSortByEnglish = [
  {
    name: 'Access Complete',
    subjects: [
      { name: 'English', featured: 1 },
      { name: 'Spanish', featured: 0 },
    ],
  },
  {
    name: 'Green Eggs and Ham',
    subjects: [
      { name: 'English', featured: 1 },
      { name: 'Spanish', featured: 0 },
    ],
  },
  {
    name: 'MLA',
    subjects: [
      { name: 'English', featured: 1 },
      { name: 'Spanish', featured: 0 },
    ],
  },
  {
    name: 'Journal of Tree Frogs',
    subjects: [
      { name: 'English', featured: 2 },
      { name: 'Spanish', featured: 0 },
    ],
  },
  {
    name: 'Monkeys',
    subjects: [
      { name: 'English', featured: 3 },
      { name: 'Spanish', featured: 1 },
    ],
  },
  {
    name: 'Comm Abstracts',
    subjects: [
      { name: 'English', featured: 0 },
      { name: 'Spanish', featured: 2 },
    ],
  },
  {
    name: 'Theatre Index',
    subjects: [
      { name: 'English', featured: 0 },
      { name: 'Spanish', featured: 0 },
    ],
  },
];
const expectedSortBySpanish = [
  {
    name: 'Monkeys',
    subjects: [
      { name: 'English', featured: 3 },
      { name: 'Spanish', featured: 1 },
    ],
  },
  {
    name: 'Comm Abstracts',
    subjects: [
      { name: 'English', featured: 0 },
      { name: 'Spanish', featured: 2 },
    ],
  },
  {
    name: 'Access Complete',
    subjects: [
      { name: 'English', featured: 1 },
      { name: 'Spanish', featured: 0 },
    ],
  },
  {
    name: 'Green Eggs and Ham',
    subjects: [
      { name: 'English', featured: 1 },
      { name: 'Spanish', featured: 0 },
    ],
  },
  {
    name: 'Journal of Tree Frogs',
    subjects: [
      { name: 'English', featured: 2 },
      { name: 'Spanish', featured: 0 },
    ],
  },
  {
    name: 'MLA',
    subjects: [
      { name: 'English', featured: 1 },
      { name: 'Spanish', featured: 0 },
    ],
  },
  {
    name: 'Theatre Index',
    subjects: [
      { name: 'English', featured: 0 },
      { name: 'Spanish', featured: 0 },
    ],
  },
];
// the following object was written based on a misunderstanding of how myguide handles
// multiple subject listings. The current approach is that the first one is the default
// and if there's no content, then it falls back to the second. It is *not* a mix of the two.
// We may want to reconsider that in the future but this is commented out so we test for
// the current realities.
//
// const expectedSortByBoth = [
//   {
//     name: 'Access Complete',
//     subjects: [
//       { name: 'English', featured: 1 },
//       { name: 'Spanish', featured: 0 },
//     ],
//   },
//   {
//     name: 'Green Eggs and Ham',
//     subjects: [
//       { name: 'English', featured: 1 },
//       { name: 'Spanish', featured: 0 },
//     ],
//   },
//   {
//     name: 'MLA',
//     subjects: [
//       { name: 'English', featured: 1 },
//       { name: 'Spanish', featured: 0 },
//     ],
//   },
//   {
//     name: 'Monkeys',
//     subjects: [
//       { name: 'English', featured: 3 },
//       { name: 'Spanish', featured: 1 },
//     ],
//   },
//   {
//     name: 'Comm Abstracts',
//     subjects: [
//       { name: 'English', featured: 0 },
//       { name: 'Spanish', featured: 2 },
//     ],
//   },
//   {
//     name: 'Journal of Tree Frogs',
//     subjects: [
//       { name: 'English', featured: 2 },
//       { name: 'Spanish', featured: 0 },
//     ],
//   },
//   {
//     name: 'Theatre Index',
//     subjects: [
//       { name: 'English', featured: 0 },
//       { name: 'Spanish', featured: 0 },
//     ],
//   },
// ];

module.exports = {
  sortableDbs,
  expectedSortByEnglish,
  expectedSortBySpanish,
  // expectedSortByBoth,
};
