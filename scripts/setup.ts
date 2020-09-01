import { exec } from 'child_process'
import { promises as fs } from 'fs'
;(async () => {
  const [, , repositoryName] = process.argv
  if (!repositoryName) return
  const fixStringProp = (obj: { [any: string]: string }, key: string) => {
    obj[key] = obj[key].replace(/my-react-ts-boilerplate/, repositoryName)
  }
  const packageJSON = JSON.parse(await fs.readFile('./package.json', 'utf-8'))
  fixStringProp(packageJSON.repository, 'url')
  fixStringProp(packageJSON.bugs, 'url')
  fixStringProp(packageJSON, 'homepage')
  await fs.writeFile('./package.json', JSON.stringify(packageJSON, null, '  '))
  exec(
    `git remote set-url origin https://github.com/AnonymousCoder2020/${repositoryName} && git merge origin master --allow-unrelated-histories`,
    (err, stdout, stderr) => {
      if (err) {
        console.log(`(setup.ts error): ${stderr}`)
        return
      }
      console.log(`(setup.ts message): ${stdout}`)
    }
  )
})()
