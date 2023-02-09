import { Controller, Get, Param, Post, Delete, Patch, Body, Query } from '@nestjs/common';
import { CreateMovieDto } from 'src/dto/create-movie.dto';
import { Movie } from './entities/movies.entity';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesController {
    constructor(private readonly moviesService: MoviesService) {}
    
    @Get()
    getAll(): Movie[] {
        return this.moviesService.getAll();
    }

    @Get("search")
    search(@Query() queries) {
        console.log(queries)

        if (queries.year) {
            return `We are searching for a movie made after: ${queries.year}`
        }
    }

    @Get(':id')
    getOne(@Param('id') id: number): Movie {
        return this.moviesService.getOne(id);
    }

    @Post()
    create(@Body() movieData: CreateMovieDto) {
        return this.moviesService.create(movieData)
    }

    @Delete('/:id')
    remove(@Param('id') movieId: number) {
        return this.moviesService.deleteOne(movieId)
    }

    @Patch(':id')
    path(@Param('id') id: number, @Body() updateData) {
        return this.moviesService.update(id, updateData)
    }
 }