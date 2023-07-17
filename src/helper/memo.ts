export default class Memo {
  private static cache: { [id: string]: any } = {}

  // Cache with id
  static call = <T extends () => Promise<any>>(
    id: string,
    fn: T,
  ): Promise<ReturnType<T>> => {
    const cache = Memo.cache[id]
    if (!cache) {
      Memo.cache[id] = new Promise((resolve, reject) =>
        fn()
          .then((res) => resolve(res))
          .catch((err) => reject(err)),
      )
    }
    return Memo.cache[id]
  }
}
