var React = require('react');
var { SketchPicker } = require('react-color');

var ColorPickerSwatch = React.createClass({
  getInitialState () {
      return { 
        displayColorPicker: false,
        color: {
          hex: this.props.color
        },
      };
  },
  classes() {
    return {
      'default': {
        popover: {
          position: 'absolute',
          zIndex: '2',
        },
        cover: {
          position: 'fixed',
          top: '0',
          right: '0',
          bottom: '0',
          left: '0',
        },
      },
    }
  },

  handleClick () {
    this.setState({ displayColorPicker: !this.state.displayColorPicker })
  },

  handleClose () {
    this.setState({ displayColorPicker: false })
  },

  handleChange (color) {
      this.setState({ color: {hex :color.hex }})
      this.props.onUpdate(color);
  },

  render() {
    var swatchStyle = {
          padding: '5px',
          background: '#fff',
          borderRadius: '1px',
          boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
          display: 'inline-block',
          cursor: 'pointer',
      };
    var colorStyle = {
      width: '36px',
      height: '14px',
      borderRadius: '2px',
      background: `${this.state.color.hex}`,
    };
    return (
      <div>
        <div style={swatchStyle} onClick={ this.handleClick }>
          <div style={colorStyle} />
        </div>
        { this.state.displayColorPicker ? <div is="popover">
          <div is="cover" onClick={ this.handleClose }/>
          <SketchPicker color={ this.state.color } onChange={ this.handleChange } />
        </div> : null }

      </div>
    )
  }
});

module.exports = ColorPickerSwatch;