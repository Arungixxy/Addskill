for _ in range(int(input())):
    n = int(input())
    arr1 = list(map(int,input().split()))
    arr2 = list(map(int,input().split()))
    ans = 0

    x = 0
    y = 0
    for index in range(n):
        if x==y and arr1[index]==arr2[index]:
            ans += arr1[index]
            
        x+=arr1[index]
        y+=arr2[index]
    print(ans)