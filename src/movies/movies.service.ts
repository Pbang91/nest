import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './../dto/create-movie.dto'
import { UpdateMovieDto } from './../dto/update-movie.dto';
import { Movie } from './entities/movies.entity';

@Injectable()
export class MoviesService {
    private moives: Movie[] = [];

    getAll(): Movie[] {
        return this.moives;
    }

    getOne(id: number): Movie {
        const movie = this.moives.find(movie => movie.id === id);

        if (!movie) {
            throw new NotFoundException("Movie not found");
        }

        return movie;
    }

    deleteOne(id: number): boolean {
        this.getOne(id);
        this.moives = this.moives.filter(movie => movie.id !== id);
        return true;
    }

    create(movieData: CreateMovieDto) {
        this.moives.push({
            id: this.moives.length + 1,
            ...movieData
        })
    }

    update(id: number, updateData: UpdateMovieDto) {
        const movie = this.getOne(id);
        this.deleteOne(id);
        this.moives.push({ ...movie, ...updateData });
        
    } 
}
