export const randShuffle = (array) => {
  let currentIndex = array.length, temporaryValue, randomIndex;

  while (0 !== currentIndex) {

    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

export const programaticShuffle = (arr, sidx = 0, eidx = arr.length - 1) => {
  if (sidx >= eidx) return;
  let mid = Math.floor((sidx + eidx) / 2);
  shuffleHelper(arr, sidx, eidx);
  programaticShuffle(arr, sidx, mid);
  programaticShuffle(arr, mid + 1, eidx);
};


export const shuffleHelper = (arr,sidx, eidx) => {
  let mid = Math.floor((sidx + eidx) / 2);
  let base, midHolder;
  if ((eidx - sidx) % 2 === 0) {
    base = mid;
    midHolder = arr[mid];
  } else {
    base = mid + 1;
    midHolder = null;
  }
  let count = 0;
  let c;
  while (sidx + count < base) {
    c = arr[mid + 1 + count];
    arr[base + count] = arr[sidx + count];
    arr[sidx + count] = c;
    count += 1;
  }
  if (midHolder) arr[eidx] = midHolder;
 };

export const programaticDeshuffle = (arr, sidx = 0, eidx = arr.length - 1) => {
  if (sidx >= eidx) return;
  let mid = Math.floor((sidx + eidx) / 2);
  programaticDeshuffle(arr, sidx, mid);
  programaticDeshuffle(arr, mid + 1, eidx);
  deshuffleHelper(arr, sidx, eidx);
};

export const deshuffleHelper = (arr,sidx, eidx) => {
  let mid = Math.floor((sidx + eidx) / 2);
  let base, midHolder;
  if ((eidx - sidx) % 2 === 0) {
    base = 1;
    midHolder = arr[mid];
  } else {
    base = 0;
    midHolder = null;
  }
    let count = 0;
  let c, l;
  while (sidx + base + count <= mid) {
    c = arr[mid + 1 + count];
    arr[mid + 1 + count] = l ? l : arr[sidx + count];
    if (midHolder) l = arr[sidx + count + base];
    arr[sidx + count + base] = c;
    count += 1;
  }
  if (midHolder) arr[sidx] = midHolder;
};
