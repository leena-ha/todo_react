import React, { Component } from 'react';
import './App.css';
import Header from './Header.jsx'
import {TodoForm, TodoList, Footer} from './components/todo'
import {addTodo, generateId, findById, toggleTodo, updateTodo, removeTodo, filterTodos} from './lib/todoHelpers'
import {pipe, partial} from './lib/utils'

class App extends Component {

  // ES2016 property initializer syntax
  state = {
    todos: [
      {id: 1, name: 'Learn about components', isComplete: true},
      {id: 2, name: 'Learn about routers', isComplete: false},
      {id: 3, name: 'Build an amazing app', isComplete: false}
    ],
    currentTodo: ''
  }

  static contextTypes = {
    route: React.PropTypes.string
  }

  handleRemove = (id, evt) => {
    evt.preventDefault()
    const updatedTodos = removeTodo(this.state.todos, id)
    this.setState({
      todos: updatedTodos
    })
  }

  handleToggle = (id) => {
    const getUpdatedTodos = pipe(findById, toggleTodo, partial(updateTodo, this.state.todos))
    const updatedTodos = updateTodo(id, this.state.todos)
    this.setState({todos: updatedTodos})
  }

  handleSubmit = (evt) => {
    evt.preventDefault()
    const newId = generateId()
    const newTodo = { id: newId, name: this.state.currentTodo, isComplete: false }
    const updatedTodos = addTodo(this.state.todos, newTodo)
    this.setState({
      todos: updatedTodos,
      currentTodo: ''
    })
  }

  handleEmptySubmit = (evt) => {
    evt.preventDefault()
  }

  handleInputChange = (evt) => {
    this.setState({
      currentTodo: evt.target.value
    })
  }

  render() {
    const submitHandler = this.state.currentTodo ? this.handleSubmit : this.handleEmptySubmit
    const displayTodos = filterTodos(this.state.todos, this.context.route)
    return (
      <div className="App">
        <Header />
        <div className="Todo-App">
          {this.state.errorMessage && <span className='error'>{this.state.errorMessage}</span>}
          <TodoForm handleInputChange={this.handleInputChange}
            currentTodo={this.state.currentTodo}
            handleSubmit={submitHandler} />
          <TodoList handleToggle={this.handleToggle} todos={displayTodos} handleRemove={this.handleRemove} />
          <Footer />
        </div>
      </div>
    );
  }
}

export default App;
