<?php

namespace App\Requests;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Validator\Validator\ValidatorInterface;

abstract class BaseRequest
{
    public function __construct(protected ValidatorInterface $validator)
    {
        $this->populate();

        if ($this->autoValidateRequest()) {
            $this->validate();
        }
    }

    public function validate()
    {
        $errors = $this->validator->validate($this);

        $messages = ['message' => 'validation_failed', 'errors' => []];

        /** @var \Symfony\Component\Validator\ConstraintViolation */
        foreach ($errors as $message) {
            $messages['errors'][] = [
                'property' => $message->getPropertyPath(),
                'value' => $message->getInvalidValue(),
                'message' => $message->getMessage(),
            ];
        }

        if (count($messages['errors']) > 0) {
            $response = new JsonResponse($messages, 400);
            $response->send();

            exit;
        }
    }

    public function getRequest(): Request
    {
        return Request::createFromGlobals();
    }

    protected function populate(): void
    {
        /** @var Symfony\Component\HttpFoundation\Request $request */
        $request = $this->getRequest();
        $params = $request->isMethod('GET') ? $request->query->all() : $request->toArray();

        $reflect = new \ReflectionClass($this);
        $properties = $reflect->getProperties();

        $result = [];
        foreach ($properties as $property) {
            $propertyName = $property->getName();
            $propertyType = null;

            // Check if the property has a type
            if ($property->hasType()) {
                $propertyType = $property->getType()->getName();
            }

            // Add property name and type to result
            $result[$propertyName] = $propertyType;
        }

        foreach ($params as $property => $value) {
            if (property_exists($this, $property)) {
                try {
                    $value = new \DateTimeImmutable($value);
                } catch (\Exception $e) {
                    if (isset($result[$property]) && $result[$property] === 'DateTimeImmutable') {
                        $value = null;
                    }
                }
                $this->{$property} = $value;
            }
        }
    }

    protected function autoValidateRequest(): bool
    {
        return true;
    }
}