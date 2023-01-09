import { ref } from 'vue'

import type { Ref} from 'vue'

interface Paths {
  'GET /xx': {
    response: {
      data: { name: string }[]
    }
  }
}

type AjaxOptions<D> = {
  action: keyof Paths
}

interface UseAjax <D> {
  data: Ref<D>
  loading: Ref<boolean>
  run: () => Promise<any>
}

export const useAjax = <D = unknown>(options: AjaxOptions<D>): UseAjax<D> => {
  const data = ref<unknown>() as any

  const loading = ref<boolean>(false)

  const run = async () => {}

  return {
    data, loading, run
  }
}

const { data } = useAjax({ action: 'GET /xx' })
