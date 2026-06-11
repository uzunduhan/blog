namespace BlogApi.Services.Results;

public enum ResultStatus { Ok, NotFound, Forbidden, Conflict }

public class ServiceResult
{
    public ResultStatus Status { get; init; }

    public static ServiceResult Ok() => new() { Status = ResultStatus.Ok };
    public static ServiceResult NotFound() => new() { Status = ResultStatus.NotFound };
    public static ServiceResult Forbidden() => new() { Status = ResultStatus.Forbidden };
    public static ServiceResult Conflict() => new() { Status = ResultStatus.Conflict };
}

public class ServiceResult<T>
{
    public ResultStatus Status { get; init; }
    public T? Data { get; init; }

    public static ServiceResult<T> Ok(T data) => new() { Status = ResultStatus.Ok, Data = data };
    public static ServiceResult<T> NotFound() => new() { Status = ResultStatus.NotFound };
    public static ServiceResult<T> Forbidden() => new() { Status = ResultStatus.Forbidden };
    public static ServiceResult<T> Conflict() => new() { Status = ResultStatus.Conflict };
}
