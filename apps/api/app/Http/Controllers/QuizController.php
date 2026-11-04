<?php

namespace App\Http\Controllers;

use App\Models\Quiz;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class QuizController extends Controller
{
    public function submit(Request $request, int $id): JsonResponse
    {
        $quiz = Quiz::whereHas('article', fn ($q) => $q->published())->with('questions')->findOrFail($id);
        $data = $request->validate([
            'answers' => ['required', 'array', 'size:'.$quiz->questions->count()],
            'answers.*' => ['required', 'array:question_id,option'],
            'answers.*.question_id' => ['required', 'integer', 'distinct:strict'],
            'answers.*.option' => ['required', 'integer', 'min:0'],
        ]);
        $answers = collect($data['answers'])->keyBy('question_id');
        $results = $quiz->questions->map(function ($question) use ($answers) {
            $answer = $answers->get($question->id);
            if (! $answer || $answer['option'] >= count($question->options)) {
                throw ValidationException::withMessages(['answers' => 'Réponses incompatibles avec ce quiz.']);
            }

            return ['question_id' => $question->id, 'correct' => (int) $answer['option'] === $question->correct_option,
                'correct_option' => $question->correct_option, 'explanation' => $question->explanation];
        });

        return response()->json(['score' => $results->where('correct', true)->count(), 'total' => $results->count(), 'results' => $results])->header('Cache-Control', 'no-store');
    }
}
