import React, { Component } from 'react';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';
import { grid, colors, borderRadius } from './constants';

const primaryButton = 0;

const getBackgroundColor = ({
  isSelected,
  isGhosting,
}) => {
  if (isGhosting) {
    return colors.grey.light;
  }

  if (isSelected) {
    return colors.blue.light;
  }

  return colors.grey.light;
}

const getColor = ({ isSelected, isGhosting }) => {
  if (isGhosting) {
    return 'darkgrey';
  }
  if (isSelected) {
    return colors.blue.deep;
  }
  return colors.black;
}

const Container = styled.div`
  background-color: ${props => getBackgroundColor(props)};
  color: ${props => getColor(props)};
  padding: ${grid}px;
  margin-bottom: ${grid}px;
  border-radius: ${borderRadius}px;
  4font-size: 18px;
  border: 1px solid ${colors.shadow};

  ${props =>
    props.isDragging
      ? `box-shadow: 2px 2px 1px ${colors.shadow};`
      : ''} ${props =>
    props.isGhosting
      ? 'opacity: 0.8;'
      : ''}

  /* needed for SelectionCount */
  position: relative;

  /* avoid default outline which looks lame with the position: absolute; */
  &:focus {
    outline: none;
    border-color: ${colors.blue.deep};
  }
`;

const Content = styled.div``;

const size = 30;

const SelectionCount = styled.div`
  right: -${grid}px;
  top: -${grid}px;
  color: ${colors.white};
  background: ${colors.blue.deep};
  border-radius: 50%;
  height: ${size}px;
  width: ${size}px;
  line-height: ${size}px;
  position: absolute;
  text-align: center;
  font-size: 0.8rem;
`;

const keyCodes = {
  enter: 13,
  escape: 27,
  arrowDown: 40,
  arrowUp: 38,
  tab: 9,
};


class Task extends Component{
  onKeyDown = (event,provided,snapshot) => {
    if (provided.dragHandleProps) {
      provided.dragHandleProps.onKeyDown(event);
    }

    if (event.defaultPrevented) {
      return;
    }

    if (snapshot.isDragging) {
      return;
    }

    if (event.keyCode !== keyCodes.enter) {
      return;
    }

    // we are using the event for selection
    event.preventDefault();

    const wasMetaKeyUsed = event.metaKey;
    const wasShiftKeyUsed = event.shiftKey;

    this.performAction(wasMetaKeyUsed, wasShiftKeyUsed);
  };

  // Using onClick as it will be correctly
  // preventing if there was a drag
  onClick = (event) => {
    if (event.defaultPrevented) {
      return;
    }

    if (event.button !== primaryButton) {
      return;
    }

    // marking the event as used
    event.preventDefault();

    const wasMetaKeyUsed = event.metaKey;
    const wasShiftKeyUsed = event.shiftKey;

    this.performAction(wasMetaKeyUsed, wasShiftKeyUsed);
  };

  onTouchEnd = (event) => {
    if (event.defaultPrevented) {
      return;
    }

    // marking the event as used
    // we would also need to add some extra logic to prevent the click
    // if this element was an anchor
    event.preventDefault();
    this.props.toggleSelectionInGroup(this.props.task.id);
  };

  performAction = (wasMetaKeyUsed, wasShiftKeyUsed) => {
    const {
      task,
      toggleSelection,
      toggleSelectionInGroup,
      multiSelectTo,
    } = this.props;
    console.log('wasMetaKeyUsed',wasMetaKeyUsed)
    console.log('wasShiftKeyUsed',wasShiftKeyUsed)
    if (wasMetaKeyUsed) {
      toggleSelectionInGroup(task.id);
      return;
    }

    if (wasShiftKeyUsed) {
      multiSelectTo(task.id);
      return;
    }

    toggleSelection(task.id);
  };

  render(){
    const task = this.props.task;
    const index = this.props.index;
    const isSelected = this.props.isSelected;
    const selectionCount = this.props.selectionCount;
    const isGhosting = this.props.isGhosting;
    return(
      <Draggable draggableId={task.id} index={index}>
        {(provided, snapshot) => {
          const shouldShowSelection =
            snapshot.isDragging && selectionCount > 1;

          return (
            <Container
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              onClick={this.onClick}
              onTouchEnd={this.onTouchEnd}
              onKeyDown={(event) =>
                this.onKeyDown(event, provided, snapshot)
              }
              isDragging={snapshot.isDragging}
              isSelected={isSelected}
              isGhosting={isGhosting}
            >
              <Content>{task.content}</Content>
              {shouldShowSelection ? (
                <SelectionCount>{selectionCount}</SelectionCount>
              ) : null}
            </Container>
          );
        }}
      </Draggable>
    )
  }
}

export default Task
