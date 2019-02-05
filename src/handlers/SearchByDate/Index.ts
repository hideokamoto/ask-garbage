import SearchByTownResult from './Result'
import SearchByTown from './Search'
import SearchByTownInprogress from './Inprogress'

const handlers = {
  Result: SearchByTownResult,
  Search: SearchByTown,
  Inprogress: SearchByTownInprogress
}

export default handlers