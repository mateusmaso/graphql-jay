from __future__ import unicode_literals

from rest_framework import viewsets

from rest_framework.response import Response

from .models import (
    People,
    Planet,
    Film,
    Species,
    Vehicle,
    Starship
)

from .serializers import (
    PeopleSerializer,
    PlanetSerializer,
    FilmSerializer,
    SpeciesSerializer,
    VehicleSerializer,
    StarshipSerializer,
    TatooineSerializer
)


class PeopleViewSet(viewsets.ReadOnlyModelViewSet):

    queryset = People.objects.all()
    serializer_class = PeopleSerializer
    search_fields = ('name',)

    def retrieve(self, request, *args, **kwargs):
        return super(PeopleViewSet, self).retrieve(request, *args, **kwargs)

    def list(self, request, *args, **kwargs):
        return super(PeopleViewSet, self).list(request, *args, **kwargs)


class PlanetViewSet(viewsets.ReadOnlyModelViewSet):

    queryset = Planet.objects.all()
    serializer_class = PlanetSerializer
    search_fields = ('name',)

    def retrieve(self, request, *args, **kwargs):
        return super(PlanetViewSet, self).retrieve(request, *args, **kwargs)

    def list(self, request, *args, **kwargs):
        return super(PlanetViewSet, self).list(request, *args, **kwargs)


class TatooineViewSet(viewsets.ReadOnlyModelViewSet):

    def list(self, request, *args, **kwargs):
        planet = Planet.objects.get(pk=1)

        serializer_context = {
            'request': request
        }

        data = TatooineSerializer(instance=planet, context=serializer_context).data

        return Response(data)


class FilmViewSet(viewsets.ReadOnlyModelViewSet):

    queryset = Film.objects.all()
    serializer_class = FilmSerializer
    search_fields = ('title',)

    def retrieve(self, request, *args, **kwargs):
        return super(FilmViewSet, self).retrieve(request, *args, **kwargs)

    def list(self, request, *args, **kwargs):
        return super(FilmViewSet, self).list(request, *args, **kwargs)


class FilmCharacterViewSet(viewsets.ReadOnlyModelViewSet):

    def list(self, request, film_pk=None):
        film = Film.objects.get(pk=film_pk)

        data = []

        serializer_context = {
            'request': request
        }

        for character in film.characters.all():
            data.append(PeopleSerializer(instance=character, context=serializer_context).data)

        return Response(data)


class SpeciesViewSet(viewsets.ReadOnlyModelViewSet):

    queryset = Species.objects.all()
    serializer_class = SpeciesSerializer
    search_fields = ('name',)

    def retrieve(self, request, *args, **kwargs):
        return super(SpeciesViewSet, self).retrieve(request, *args, **kwargs)

    def list(self, request, *args, **kwargs):
        return super(SpeciesViewSet, self).list(request, *args, **kwargs)


class VehicleViewSet(viewsets.ReadOnlyModelViewSet):

    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer
    search_fields = ('name','model',)

    def retrieve(self, request, *args, **kwargs):
        return super(VehicleViewSet, self).retrieve(request, *args, **kwargs)

    def list(self, request, *args, **kwargs):
        return super(VehicleViewSet, self).list(request, *args, **kwargs)


class StarshipViewSet(viewsets.ReadOnlyModelViewSet):

    queryset = Starship.objects.all()
    serializer_class = StarshipSerializer
    search_fields = ('name','model',)

    def retrieve(self, request, *args, **kwargs):
        return super(StarshipViewSet, self).retrieve(request, *args, **kwargs)

    def list(self, request, *args, **kwargs):
        return super(StarshipViewSet, self).list(request, *args, **kwargs)
