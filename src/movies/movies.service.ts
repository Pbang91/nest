import { Injectable, NotFoundException } from '@nestjs/common';
import { Movie } from './entities/movies.entity';

@Injectable()
export class MoviesService {
    private moives: Movie[] = [];

    getAll(): Movie[] {
        return this.moives;
    }

    getOne(id: string): Movie {
        const movie = this.moives.find(movie => movie.id === parseInt(id));

        if (!movie) {
            throw new NotFoundException("Movie not found");
        }

        return movie;
    }

    deleteOne(id: string): boolean {
        this.getOne(id);
        this.moives = this.moives.filter(movie => movie.id !== +id);
        return true;
    }

    create(movieData) {
        this.moives.push({
            id: this.moives.length + 1,
            ...movieData
        })
    }

    update(id: string, updateData) {
        const movie = this.getOne(id);

        this.deleteOne(id);
        this.moives.push({ ...movie, ...updateData });
        
    } 
}
