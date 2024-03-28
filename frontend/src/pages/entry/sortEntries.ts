import { Entry} from "./JournalEntriesPage";


export function sortEntriesByDate(entries: Entry[] | null, sortOrder: string): Entry[] {
  // defensive programming
  if (!entries) {
    return Array<Entry>();
  }
  // zipping the entries with their creation date
  const zippedEntries = entries.map((entry) => {
    return [entry, new Date(entry.creation_date).getTime()] as [Entry, number];
  })

  timSort(zippedEntries);

  // returns the sorted entries in unzipped format
  if (sortOrder === "desc") {
    return zippedEntries.map((zippedEntry) => zippedEntry[0]).reverse();
  }
  return zippedEntries.map((zippedEntry) => zippedEntry[0]);
}


function insertionSort<Key>(
  arr: Array<[Entry, Key]>,
  startIndex: number,
  endIndex: number,
) {

  // iterate the segment of the array from startIndex to endIndex
  for (let i = startIndex + 1; i < endIndex; i++) {
    // increment the currently searching index i with each pass, and use j as a temprary index to compare the current element with all previous elements
    let j = i;

    while (j > startIndex && arr[j - 1][1] > arr[j][1]) {

      // compare the current element with every single previous element and keep swapping until it is in the right position
      swap(arr, j, j - 1);
      j--;
    }
  }
}

function swap<T>(arr: Array<[Entry, T]>, i: number, j: number) {
  const temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}


function merge<Key>(arr: Array<[Entry, Key]>, left: number, mid: number, right: number) {
  // the two different segments sorted by insertion sort need to be merged, the left segment is from left to mid, and the right segment is from mid to right
  const leftArr = arr.slice(left, mid);
  const rightArr = arr.slice(mid, right);


  // i is the index of the left segment, j is the index of the right segment, and k is the index of the merged segment
  let i = 0;
  let j = 0;
  let k = left;
  
  // going through all the elements of the left and right segments and compare them, and merge them in the right order
  while (i < leftArr.length && j < rightArr.length) {
    
    // basically means if the left element is smaller than the right element, then put the left element in the merged segment, otherwise put the right element in the merged segment in that sequence
    if (leftArr[i][1] <= rightArr[j][1]) {
      arr[k] = leftArr[i];
      i++;
    } else {
      arr[k] = rightArr[j];
      j++;
    }
    k++;
  }

  // if there are any remaining elements in the left or right segment, then put them in the merged segment
  while (i < leftArr.length) {
    arr[k] = leftArr[i];
    i++;
    k++;
  }

  while (j < rightArr.length) {
    arr[k] = rightArr[j];
    j++;
    k++;
  }
}

function timSort<Key>(zippedEntries: Array<[Entry, Key]>){
  // run means the size of the segments that will be sorted by insertion sort
  const RUN = 16;
  const n = zippedEntries.length;

  // use insertion sort on all the individual runs with the size of RUN
  for (let i = 0; i < n; i += RUN) {
    // math.min is used so that the sorting does not go out of bounds
    insertionSort(zippedEntries, i, Math.min(i + RUN, n));
  }


  // merge all the the sorted segments
  for (let size = RUN; size < n; size = 2 * size) {
    for (let left = 0; left < n; left += 2 * size) {
      const mid = left + size;
      const right = Math.min(left + 2 * size, n);
      merge(zippedEntries, left, mid, right);
    }
  }
}
