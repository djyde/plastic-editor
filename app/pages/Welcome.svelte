<script lang="ts">
  import * as db from '../db'
import NotePage from './NotePage.svelte'

  const today = db.touchTodayDailyNote()
</script>

<div>
  <NotePage params={{ pageId: today.id }} />
</div>