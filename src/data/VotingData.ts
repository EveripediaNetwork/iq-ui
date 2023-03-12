export const VoteQl = JSON.stringify({
  query: `
      query Proposals {
        proposals(where: {space_in: ["everipediaiq.eth"], state: "all", author_in: []}, orderBy: "created", orderDirection: desc) {
          id
          ipfs
          title
          body
          start
          end
          state
          author
          created
          choices
          space {
            id
            name
            members
            avatar
            symbol
          }
          scores_state
          scores_total
          scores
          votes
          quorum
          symbol
        }
      }
      `,
  variables: {},
})
