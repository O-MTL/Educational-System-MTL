"""
Exception handlers para Django REST Framework
"""
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
from django.db import IntegrityError
import traceback


def custom_exception_handler(exc, context):
    """
    Custom exception handler que devuelve JSON en lugar de HTML
    """
    # Manejar errores de integridad (UNIQUE constraint, etc.)
    if isinstance(exc, IntegrityError):
        error_message = str(exc)
        # Detectar si es un error de matrícula duplicada
        if 'matricula' in error_message.lower() or 'UNIQUE constraint failed: school_alumno.matricula' in error_message:
            return Response(
                {
                    'error': 'Error de validación',
                    'detail': {
                        'matricula': ['Ya existe un estudiante con esta cédula/matrícula. Por favor, usa una cédula diferente.']
                    },
                    'status_code': status.HTTP_400_BAD_REQUEST
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        # Otros errores de integridad
        else:
            return Response(
                {
                    'error': 'Error de validación',
                    'detail': {
                        'non_field_errors': [f'Error de integridad: {error_message}']
                    },
                    'status_code': status.HTTP_400_BAD_REQUEST
                },
                status=status.HTTP_400_BAD_REQUEST
            )
    
    # Llamar al handler por defecto de DRF
    response = exception_handler(exc, context)
    
    # Si no hay respuesta, es un error no manejado por DRF
    if response is None:
        # Obtener el traceback para debugging
        error_detail = str(exc)
        if hasattr(exc, '__traceback__'):
            tb = traceback.format_exception(type(exc), exc, exc.__traceback__)
            error_detail = ''.join(tb)
        
        # Devolver respuesta JSON
        return Response(
            {
                'error': 'Error interno del servidor',
                'detail': str(exc),
                'type': type(exc).__name__
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    
    # Personalizar la respuesta de error
    # Si response.data es un diccionario con errores de validación, mantenerlo
    if isinstance(response.data, dict):
        # Si es un error de validación, devolver los detalles directamente
        if response.status_code == status.HTTP_400_BAD_REQUEST:
            custom_response_data = {
                'error': 'Error de validación',
                'detail': response.data,  # Mantener los errores de validación
                'status_code': response.status_code
            }
        else:
            custom_response_data = {
                'error': 'Error en la solicitud',
                'detail': response.data,
                'status_code': response.status_code
            }
    elif isinstance(response.data, str):
        custom_response_data = {
            'error': 'Error en la solicitud',
            'detail': response.data,
            'status_code': response.status_code
        }
    else:
        custom_response_data = {
            'error': 'Error en la solicitud',
            'detail': str(response.data),
            'status_code': response.status_code
        }
    
    return Response(custom_response_data, status=response.status_code)

