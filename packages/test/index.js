const { sortByField } = require('@phoenix_fan/lodash-es')

const list = [
  {
    age: 18,
    height: 172,
    name: '蔡徐坤'
  },
  {
    age: 18,
    height: 170,
    name: '张艺兴'
  },
  {
    age: 16,
    height: 160,
    name: '王心凌'
  },
  {
    age: 16,
    height: 160,
    name: '田馥甄'
  },
]

list.sort(sortByField({
  field: 'age',
  next: sortByField({
    field: 'height',
    sortRule: (a, b) => (b.height - a.height),
    next: sortByField({
      field: 'name', 
      sortRule: (a, b) => a.name.localeCompare(b.name)
    })
  })
}))

console.log(list)