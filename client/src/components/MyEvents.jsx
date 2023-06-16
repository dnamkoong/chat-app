export const MyEvents = ({ messages }) => {
  return (
    <>
      <ul>
        {
          messages.map((message, index) => (
            <li key={index}>{message}</li>
          ))
        }
      </ul>
    </>
  )
}