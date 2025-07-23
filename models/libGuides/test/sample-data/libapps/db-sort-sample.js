const sortableDbs = [
  {
    name: 'Monkeys',
    featured: 3,
  },
  {
    name: 'Journal of Tree Frogs',
    featured: 2,
  },
  {
    name: 'Comm Abstracts',
    featured: 0,
  },
  {
    name: 'Access Complete',
    featured: 1,
  },
  {
    name: 'MLA',
    featured: 1,
  },
  {
    name: 'Green Eggs and Ham',
    featured: 1,
  },
  {
    name: 'Theatre Index',
    featured: 0,
  },
];

const expectedSort = [
  {
    name: 'Access Complete',
    featured: 1,
  },
  {
    name: 'Green Eggs and Ham',
    featured: 1,
  },
  {
    name: 'MLA',
    featured: 1,
  },
  {
    name: 'Journal of Tree Frogs',
    featured: 2,
  },
  {
    name: 'Monkeys',
    featured: 3,
  },
  {
    name: 'Comm Abstracts',
    featured: 0,
  },
  {
    name: 'Theatre Index',
    featured: 0,
  },
];

module.exports = { sortableDbs, expectedSort };
