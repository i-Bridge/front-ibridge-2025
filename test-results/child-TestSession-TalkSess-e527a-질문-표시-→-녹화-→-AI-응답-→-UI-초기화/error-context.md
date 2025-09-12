# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - region "Notifications alt+T"
  - main [ref=e4]:
    - generic [ref=e5]:
      - img "캐릭터" [ref=e7]
      - generic [ref=e9]:
        - img "말풍선 배경" [ref=e10]
        - generic [ref=e11]:
          - paragraph
          - button [ref=e12] [cursor=pointer]:
            - img [ref=e13] [cursor=pointer]
  - generic:
    - generic [ref=e17] [cursor=pointer]:
      - img [ref=e18] [cursor=pointer]
      - generic [ref=e20] [cursor=pointer]: 1 error
      - button "Hide Errors" [ref=e21] [cursor=pointer]:
        - img [ref=e22] [cursor=pointer]
    - status [ref=e25]:
      - generic [ref=e26]:
        - img [ref=e28]
        - generic [ref=e30]:
          - text: Static route
          - button "Hide static indicator" [ref=e31] [cursor=pointer]:
            - img [ref=e32] [cursor=pointer]
  - alert [ref=e35]
```