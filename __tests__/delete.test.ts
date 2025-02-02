import {Input, InputParams} from '../src/input'
import {deleteVersions, getVersionIds} from '../src/delete'

describe.skip('index tests -- call graphql', () => {
  it('getVersionIds test -- get oldest version', done => {
    const numVersions = 1

    getVersionIds(getInput({numOldVersionsToDelete: numVersions})).subscribe(
      ids => {
        expect(ids.length).toBeLessThanOrEqual(numVersions)
        done()
      }
    )
  })

  it('getVersionIds test -- get oldest 3 versions', done => {
    const numVersions = 3

    getVersionIds(getInput({numOldVersionsToDelete: numVersions})).subscribe(
      ids => {
        expect(ids.length).toBeLessThanOrEqual(numVersions)
        done()
      }
    )
  })

  it('getVersionIds test -- supplied package version id', done => {
    const suppliedIds = [
      'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
      'BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
      'CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC'
    ]

    getVersionIds(getInput({packageVersionIds: suppliedIds})).subscribe(ids => {
      expect(ids).toBe(suppliedIds)
      done()
    })
  })

  it('deleteVersions test -- missing token', done => {
    deleteVersions(getInput({token: ''})).subscribe({
      error: err => {
        expect(err).toBeTruthy()
        done()
      },
      complete: async () => done.fail('no error thrown')
    })
  })

  it('deleteVersions test -- missing packageName', done => {
    deleteVersions(getInput({packageName: ''})).subscribe({
      error: err => {
        expect(err).toBeTruthy()
        done()
      },
      complete: async () => done.fail('no error thrown')
    })
  })

  it.skip('deleteVersions test -- delete oldest version', done => {
    deleteVersions(
      getInput({numOldVersionsToDelete: 2, minVersionsToKeep: 1})
    ).subscribe(isSuccess => {
      expect(isSuccess).toBe(true)
      done()
    })
  })

  it.skip('deleteVersions test -- delete 3 oldest versions', done => {
    deleteVersions(
      getInput({numOldVersionsToDelete: 3, minVersionsToKeep: 1})
    ).subscribe(isSuccess => {
      expect(isSuccess).toBe(true)
      done()
    })
  })

  it('deleteVersions test -- keep 5 versions', done => {
    deleteVersions(getInput({minVersionsToKeep: 5})).subscribe(isSuccess => {
      expect(isSuccess).toBe(true)
      done()
    })
  })
})

const defaultInput: InputParams = {
  packageVersionIds: [],
  owner: 'namratajha',
  repo: 'only-pkg',
  packageName: 'onlypkg.maven',
  numOldVersionsToDelete: 1,
  minVersionsToKeep: 1,
  token: process.env.GITHUB_TOKEN as string
}

function getInput(params?: InputParams): Input {
  return new Input({...defaultInput, ...params})
}
