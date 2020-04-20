import { connect } from 'react-redux';
import { createRoom } from '../../actions/room_actions';
import CreateForm from './create_form';

const mapStateToProps = (state) => {
    return {
        errors: state.errors.room
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        createRoom: room => dispatch(createRoom(room))
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CreateForm);

