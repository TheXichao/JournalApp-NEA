my_array = [3, 6, 8, 10, 1, 2, 1]


def quicksort(array):
    if len(array) == 0:
        return array

    pivot = array[0]
    leftSubarray = []
    rightSubarray = []

    for element in array[1:]:
        # iterating through the array starting from the second element to the end
        if element < pivot:
            leftSubarray.append(element)
        else:
            rightSubarray.append(element)

    leftSubarray = quicksort(leftSubarray)
    rightSubarray = quicksort(rightSubarray)

    return leftSubarray + [pivot] + rightSubarray


print(quicksort(my_array))
