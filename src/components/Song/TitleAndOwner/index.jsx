import styled from 'styled-components'


const StyledOwner = styled.div`
font-weight: 700`;

const SongTitleAndOwner = (props) => {
  return (
    <>
      <div className="songTitle">{props.title}</div>
      <StyledOwner>{props.owner}</StyledOwner>
    </>
  );
}


export default SongTitleAndOwner