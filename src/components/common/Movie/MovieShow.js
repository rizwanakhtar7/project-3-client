import React from 'react'

import { useParams, useHistory, Link } from 'react-router-dom'
import { getSingleMovie, deleteMovie, deleteComment } from '../../../lib/api'
import { isAdmin, isOwner, isAuthenticated } from '../../../lib/auth'
import NewComment from '../comment/NewComment'
import NotFound from '../NotFound'
import RatingDisplay from './RatingDisplay'


function MovieShow() {
  const history = useHistory()
  const { movieId } = useParams()
  const [movie, setMovie] = React.useState(null)
  const [isError, setIsError] = React.useState(null)
  const isLoading = !movie && !isError
  const isLoggedIn = isAuthenticated()


  React.useEffect(() => {
    const getSingleMovieData = async () => {
      try {
        const res = await getSingleMovie(movieId)
        setMovie(res.data)

      } catch (e) {
        setIsError(true)
        console.log(e)
      }
    }
    getSingleMovieData()

  }, [movieId])

  const handleDeleteMovie = async () => {
    await deleteMovie(movie._id)
    history.push('/movies')
  }


  const handleDeleteComment = async (commentId) => {
    await deleteComment(movie._id, commentId)
    setMovie({
      ...movie, comments: movie.comments.filter((comment) => {
        return comment._id !== commentId
      }),
    })
  }



  movie && console.log(movie.moods)

  return (
    <section id="new-movie">
      {isError && <NotFound />}
      {isLoading && <div className="error-message-container"><p className="error-message">...loading movie - grab the popcorn! 🍿 </p></div>}
      {movie && (
        <>
          <div className="show-movie-container">
            <article>
              <div>
                <img className="poster" src={movie.poster} />
              </div>
              <div>
                <div>
                  <h1>{movie.title} <span>({movie.year})</span></h1>

                  {movie.moods.map(({ mood }) => (
                    <button
                      key={mood._id}
                      value={mood}
                      className="mood-button inactive"
                    >
                      {mood.mood}
                    </button>
                  ))}
                  <div className="buttons-container">
                    {isLoggedIn && <><Link to={`/movies/${movie._id}/mood`} className="button"
                    ><button className="small">Add Moods</button></Link></>}
                    
                  </div>
                </div>
                <div>
                  <h2>Director</h2>
                  <p>{movie.director}</p>
                </div>
                <div>
                  <h2>Actors</h2>
                  <p>{movie.actors}</p>
                </div>
                <div>
                  <h2>Plot</h2>
                  <p className="plot">{movie.plot}</p>
                </div>
                <div>
                  <h2>Release Date</h2>
                  <p>{movie.released}</p>
                </div>
                <div>
                  <h2>Runtime</h2>
                  <p>{movie.runtime}</p>
                </div>
                <div>
                  <h2>Genres</h2>
                  <p>{movie.genres}</p>
                </div>
                <div>
                  <h2>Rated</h2>
                  <p>{movie.rated}</p>
                </div>
                <div>
                  <h2>Languages</h2>
                  <p>{movie.language}</p>
                </div>
                <div>
                  {movie.ratings.map((rating) => {
                    return <RatingDisplay key={rating._id} rating={rating} />
                  }
                  )}
                </div>
              </div>
            </article>
            {isLoggedIn && isAdmin() && (
              <>
                <div>
                  <div className="buttons-container">
                    <Link
                      to={`/movies/${movie._id}/edit`} 
                    ><button className="submit-button"><span className="material-icons">
                        edit
                      </span>Edit Movie
                      </button></Link>
                    <button onClick={handleDeleteMovie} className="submit-button">
                      <span className="material-icons">
                        delete
                      </span>Delete Movie
                    </button>
                  </div>
                </div>
              </>
            )}


            <section id="comments">
              <div>
                <h2>Comments</h2>
                <NewComment movie={movie} setMovie={setMovie} />
                {movie.comments.slice(0).reverse().map((comment) => {
                  return <section key={comment._id} >
                    <hr></hr>
                    <div className="comments-container">
                      <div>
                        <h4><span className="material-icons by">
                        account_circle
                        </span> By {comment.user.username}</h4>
                        <p>{comment.text}</p>
                      </div>
                      <div className="delete-comment-container">
                        {isLoggedIn && (isAdmin() || isOwner(comment.user._id)) &&
                        <button 
                          onClick={() => handleDeleteComment(comment._id)} className="delete-comment">
                          <span className="material-icons">
                          delete
                          </span>
                        </button>
                        }
                      </div>
                      
                    </div>
                  </section>
                })}
              </div>
            </section >
          </div>
        </>
      )
      }
    </section >


  )
}






export default MovieShow