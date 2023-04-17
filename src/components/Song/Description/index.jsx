import styled from "styled-components";

const StyledDescription = styled.div``;

const SongDescription = (props) => {
  return <StyledDescription>{props.description}</StyledDescription>;
};

export default SongDescription;
